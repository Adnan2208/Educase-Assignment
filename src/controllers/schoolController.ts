import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ResultSetHeader } from 'mysql2';
import pool from '../db';

interface School {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface SchoolWithDistance extends School {
  distance: number;
}

// Formula to find straight line distance from lat and lon
const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const addSchool = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }

  const { name, address, latitude, longitude } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );
    const insertResult = result as ResultSetHeader;
    res.status(201).json({
      success: true,
      message: 'School added',
      data: {
        id: insertResult.insertId,
        name,
        address,
        latitude,
        longitude,
      },
    });
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const listSchools = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }

  const userLat = parseFloat(req.query.latitude as string);
  const userLon = parseFloat(req.query.longitude as string);

  try {
    const [rows] = await pool.query('SELECT * FROM schools');
    const schools = rows as School[];

    const schoolsWithDistance: SchoolWithDistance[] = schools.map((school) => ({
      ...school,
      distance: haversineDistance(
        userLat,
        userLon,
        parseFloat(school.latitude as any),
        parseFloat(school.longitude as any)
      ),
    }));

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      data: schoolsWithDistance,
    });
  } catch (error) {
    console.error('Error listing schools:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};