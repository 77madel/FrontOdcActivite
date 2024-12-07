import * as XLSX from 'xlsx';

export function exportToExcel(data: any[], fileName: string): void {
  // Créer une feuille à partir des données
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  // Générer le fichier Excel
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}


// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

// export function exportToPDF(data: any[], columns: string[], fileName: string): void {
//   const doc = new jsPDF();

//   // Ajouter un titre
//   doc.text('Liste des Résultats', 14, 10);

//   // Ajouter les données dans un tableau
//   const tableData = data.map(item => columns.map(col => item[col]));
//   doc.autoTable({
//     head: [columns],
//     body: tableData,
//   });

//   // Sauvegarder le PDF
//   doc.save(`${fileName}.pdf`);
// }
