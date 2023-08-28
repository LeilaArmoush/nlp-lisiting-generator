import React, { useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const apiKey = 'AIzaSyA1TqKRfSIc-j434xD5Vt4UrJDRGc07jkA';

  const handleAnalyzeClick = async () => {
    try {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      const file = fileInput.files?.[0];

        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            const requestData = {
                requests: [
                    {
                        image: {
                            content: await getBase64(file),
                        },
                        features: [
                            {
                                type: 'LABEL_DETECTION',
                                maxResults: 5,
                            },
                        ],
                    },
                ],
            };

            const response = await axios.post(
                `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json', // Set the Content-Type header
                    },
                }
            );

            const labels = response.data.responses[0].labelAnnotations;
            const labelDescriptions = labels.map((label: any) => label.description);
            setResults(labelDescriptions);
        }
    } catch (error) {
        console.error('Error analyzing image', error);
    }
  };

  const getBase64 = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

  return (
      <div>
        <input type="file" id="fileInput" accept="image/*" />
        <button onClick={handleAnalyzeClick}>Analyze Image</button>
        <ul>
          {results.map((label, index) => (
              <li key={index}>{label}</li>
          ))}
        </ul>
      </div>
  );
};

export default App;
