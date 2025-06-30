import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut, FiX } = FiIcons;

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ file, onClose, onExtractData, type }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isExtracting, setIsExtracting] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => {
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);
  };

  const goToNextPage = () => {
    setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);
  };

  const zoomIn = () => {
    setScale(scale < 2 ? scale + 0.2 : scale);
  };

  const zoomOut = () => {
    setScale(scale > 0.6 ? scale - 0.2 : scale);
  };

  const handleExtractData = async () => {
    setIsExtracting(true);
    try {
      await onExtractData(file, type);
    } catch (error) {
      console.error('Data extraction failed:', error);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800 rounded-xl w-full max-w-4xl h-[90vh] border border-slate-700 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-white">PDF Viewer</h2>
            <div className="text-slate-400 text-sm">
              {file?.name}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={handleExtractData}
              disabled={isExtracting}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isExtracting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <span>Extract Data</span>
              )}
            </motion.button>
            
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700"
            >
              <SafeIcon icon={FiX} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-750">
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="p-2 text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SafeIcon icon={FiChevronLeft} />
            </button>
            
            <span className="text-slate-300 text-sm">
              Page {pageNumber} of {numPages || '?'}
            </span>
            
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="p-2 text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SafeIcon icon={FiChevronRight} />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={zoomOut}
              className="p-2 text-slate-300 hover:text-white"
            >
              <SafeIcon icon={FiZoomOut} />
            </button>
            
            <span className="text-slate-300 text-sm min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            
            <button
              onClick={zoomIn}
              className="p-2 text-slate-300 hover:text-white"
            >
              <SafeIcon icon={FiZoomIn} />
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-auto bg-slate-700 flex items-center justify-center p-4">
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p>Loading PDF...</p>
              </div>
            }
            error={
              <div className="text-red-400 text-center">
                <p>Failed to load PDF</p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              loading={
                <div className="text-white">Loading page...</div>
              }
              error={
                <div className="text-red-400">Failed to load page</div>
              }
              className="shadow-lg"
            />
          </Document>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PDFViewer;