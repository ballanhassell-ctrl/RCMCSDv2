import React, { useMemo, useState } from "react";
import { useLocalStorageJSON } from "./useLocalStorageJSON";

type MonthlyMap = Record<string, number>;

/** Editor bound directly to the 'monthlyData' key that your app reads. */
export default function MonthlyDataEditorBound(){
  const [monthlyData, setMonthlyData] = useLocalStorageJSON<MonthlyMap>("monthlyData", {});
  const [k, setK] = useState(""); 
  const [v, setV] = useState<string|number>("");
  const entries = useMemo(()=>Object.entries(monthlyData||{}), [monthlyData]);

  const add = ()=>{
    if(!k) return;
    const amt = Number(v||0);
    setMonthlyData({ ...(monthlyData||{}), [k]: amt });
    setK(""); setV("");
  };
  const del = (idx: number)=>{
    const key = entries[idx][0];
    const next = { ...(monthlyData||{}) } as any;
    delete next[key];
    setMonthlyData(next);
  };
  const clear = ()=>{ if(confirm("Clear ALL monthly data?")) setMonthlyData({}); };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-3">
      <h3 className="text-lg font-semibold text-gray-800">Monthly Collections Data</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input className="border rounded p-2" placeholder="Label (e.g., January 2025)" value={k} onChange={(e)=>setK(e.target.value)} />
        <input className="border rounded p-2" type="number" step={0.01} placeholder="Amount" value={v} onChange={(e)=>setV(e.target.value)} />
        <button onClick={add} className="bg-indigo-600 text-white rounded p-2">Add/Update</button>
        <button onClick={clear} className="bg-red-600 text-white rounded p-2">Clear All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b"><tr><th className="px-3 py-2 text-left">Month</th><th className="px-3 py-2 text-left">Amount</th><th className="px-3 py-2">Actions</th></tr></thead>
          <tbody className="divide-y">
            {entries.map(([key, val], idx)=>(
              <tr key={key}>
                <td className="px-3 py-2">{key}</td>
                <td className="px-3 py-2">${Number(val||0).toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td className="px-3 py-2"><button onClick={()=>del(idx)} className="text-red-600 underline">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
