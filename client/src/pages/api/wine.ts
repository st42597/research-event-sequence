import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  async function loadData() {
    const data = await axios.get('http://localhost:8000/wine/', { params: req.query }).then(res => res.data);
    res.status(200).json(data)
  }
  loadData();
}
