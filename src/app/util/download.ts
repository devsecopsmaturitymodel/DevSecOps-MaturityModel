export function downloadYamlFile(data: string, filename: string): void {
  const blob = new Blob([data], { type: 'application/yaml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.split('/').pop() || 'download.yaml';
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
