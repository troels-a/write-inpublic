'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea and focus on load
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      textareaRef.current.focus();
    }
  }, [text]);

  const handleTextChange = (e) => {
    setText(e.target.value.toUpperCase());
  };

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set text style for measurements
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    
    // First split by manual line breaks
    const paragraphs = text.split('\n');
    let lines = [];
    let maxLineWidth = 0;
    
    // Then handle word wrapping for each paragraph
    paragraphs.forEach(paragraph => {
      if (paragraph.trim() === '') {
        lines.push('');
        return;
      }

      const words = paragraph.split(' ');
      let currentLine = '';
      
      words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > 700) { // Leave some margin
          lines.push(currentLine);
          maxLineWidth = Math.max(maxLineWidth, ctx.measureText(currentLine).width);
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      });
      
      if (currentLine) {
        lines.push(currentLine);
        maxLineWidth = Math.max(maxLineWidth, ctx.measureText(currentLine).width);
      }
    });

    // Set canvas size based on content
    const lineHeight = 40;
    const verticalPadding = 80;
    const horizontalPadding = 60;
    
    canvas.width = Math.max(800, maxLineWidth + horizontalPadding * 2);
    canvas.height = Math.max(lines.length * lineHeight + verticalPadding * 2, 200);
    
    // Set background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Reset text style after canvas resize
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    
    // Draw text
    lines.forEach((line, i) => {
      if (line) {
        ctx.fillText(line, canvas.width / 2, verticalPadding + i * lineHeight);
      }
    });
    
    // Create download link
    const link = document.createElement('a');
    link.download = 'message.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={text}
          onChange={handleTextChange}
          placeholder="INPUBLIC"
          rows={1}
          spellCheck="false"
          autoFocus
        />
        <button 
          className={styles.download}
          onClick={handleDownload}
        >
          Download
        </button>
      </div>
    </main>
  );
}
