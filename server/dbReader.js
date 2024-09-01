import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pkg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
//gZGX9TEMTDkkC1cA
//MoveoProjectDB

const getCodes = (req, res) => {
    pool.query('SELECT * FROM public."Code"', (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  }

const getCodeById = (req, response) => {
    const id = parseInt(req.params.id)
    pool.query('SELECT * FROM public."Code" WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      if (results.rows.length === 0) {
        return response.status(404).json({ error: 'Code not found' });
      }
      response.status(200).json(results.rows[0])
    })
  }
  const createCode = (req, res) => {
    const { template,expectedCode, name } = req.body;
    pool.query(
      'INSERT INTO public."Code" (currcodes,expectedcodes, name) VALUES ($1, $2, $3) RETURNING id',
      [template,expectedCode, name],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).json({ id: results.rows[0].id });
      }
    );
  };

  export default {
    getCodes,
    getCodeById,
    createCode
  }