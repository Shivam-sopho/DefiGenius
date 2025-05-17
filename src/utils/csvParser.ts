
import { QuizQuestion } from "@/types/quiz-types";
import * as XLSX from 'xlsx';

export const parseCSVToQuestions = (csvContent: string): QuizQuestion[] => {
  try {
    // Split CSV content by lines and remove empty lines
    const lines = csvContent
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);
    
    // Check if there's a header
    const hasHeader = lines[0].toLowerCase().includes('question') || 
                      lines[0].toLowerCase().includes('option') || 
                      lines[0].toLowerCase().includes('answer');
    
    const startIndex = hasHeader ? 1 : 0;
    
    return lines.slice(startIndex).map((line, index) => {
      // Split by comma but respect quoted values
      const values = line.split(',').map(val => val.trim());
      
      if (values.length < 6) {
        throw new Error(`Line ${index + startIndex + 1} has insufficient columns. Expected at least 6 columns (Question, Option1, Option2, Option3, Option4, Answer)`);
      }
      
      const question = values[0];
      const options = [values[1], values[2], values[3], values[4]];
      const answerIndicator = values[5];
      const explanation = values.length > 6 ? values[6] : '';
      
      // Check if answer is a number reference to option index
      let answer = answerIndicator;
      if (/^[1-4]$/.test(answerIndicator)) {
        const optionIndex = parseInt(answerIndicator) - 1;
        if (optionIndex >= 0 && optionIndex < options.length) {
          answer = options[optionIndex];
        }
      }
      
      return {
        id: index + 1,
        question,
        options,
        answer,
        answerIndex: /^[1-4]$/.test(answerIndicator) ? parseInt(answerIndicator) : null,
        explanation
      };
    });
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw new Error('Failed to parse CSV. Please ensure it matches the required format.');
  }
};

export const parseExcelToQuestions = (file: File): Promise<QuizQuestion[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Check if there's a header
        const hasHeader = 
          String(jsonData[0][0]).toLowerCase().includes('question') || 
          String(jsonData[0][1]).toLowerCase().includes('option') || 
          String(jsonData[0][5]).toLowerCase().includes('answer');
        
        const startIndex = hasHeader ? 1 : 0;
        
        const questions: QuizQuestion[] = [];
        
        for (let i = startIndex; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          
          if (row.length < 6) {
            console.warn(`Row ${i + 1} has insufficient columns. Skipping.`);
            continue;
          }
          
          const question = String(row[0]);
          const options = [
            String(row[1]), 
            String(row[2]), 
            String(row[3]), 
            String(row[4])
          ];
          const answerIndicator = String(row[5]);
          const explanation = row.length > 6 ? String(row[6]) : '';
          
          // Check if answer is a number reference to option index
          let answer = answerIndicator;
          if (/^[1-4]$/.test(answerIndicator)) {
            const optionIndex = parseInt(answerIndicator) - 1;
            if (optionIndex >= 0 && optionIndex < options.length) {
              answer = options[optionIndex];
            }
          }
          
          questions.push({
            id: i - startIndex + 1,
            question,
            options,
            answer,
            answerIndex: /^[1-4]$/.test(answerIndicator) ? parseInt(answerIndicator) : null,
            explanation
          });
        }
        
        resolve(questions);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        reject(new Error('Failed to parse Excel file. Please ensure it matches the required format.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading Excel file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
