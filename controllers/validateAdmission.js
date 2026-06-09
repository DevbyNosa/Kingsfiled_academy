import pool from "../database/config/db.js";




export const approveAdmission = async (req,res) => {
   const id =req.params.id;


   const studentPaidAdmission = await pool.query(`UPDATE application SET status = $1 WHERE id = $2`, ["approved", id]);
   
}