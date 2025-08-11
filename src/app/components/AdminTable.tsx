'use client';

import { motion } from 'framer-motion';

interface AdminTableProps {
  title: string;
  columns: string[];
  data: Record<string, string>[];
}

export default function AdminTable({ title, columns, data }: AdminTableProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="border p-2 text-left">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <motion.tr
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="border"
            >
              {columns.map((col) => (
                <td key={col} className="p-2">
                  {row[col]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}