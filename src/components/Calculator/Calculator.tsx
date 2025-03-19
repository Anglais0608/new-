'use client';

import React, { useState, useEffect } from 'react';
import { evaluate, complex, ComplexNumber } from 'mathjs';
import ComplexGraph from '@/components/ComplexGraph/ComplexGraph';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isResult, setIsResult] = useState(false);
  const [isComplex, setIsComplex] = useState(false);
  const [activeTab, setActiveTab] = useState('standard');
  const [graphEquation, setGraphEquation] = useState('a^z - z');
  const [parameterA, setParameterA] = useState(2);
  const [isMobile, setIsMobile] = useState(false);
  const [showAdvancedFunctions, setShowAdvancedFunctions] = useState(false);

  // Détecter si l'appareil est mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleNumberClick = (num: string) => {
    if (isResult) {
      setDisplay(num);
      setExpression(num);
      setIsResult(false);
    } else {
      if (display === '0') {
        setDisplay(num);
        setExpression(num);
      } else {
        setDisplay(display + num);
        setExpression(expression + num);
      }
    }
  };

  const handleOperatorClick = (operator: string) => {
    setIsResult(false);
    setDisplay(operator);
    setExpression(expression + operator);
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setIsResult(false);
  };

  const handleCalculate = () => {
    try {
      // Utiliser mathjs pour évaluer l'expression
      const result = evaluate(expression);
      
      // Vérifier si le résultat est un nombre complexe
      if (typeof result === 'object' && result.re !== undefined && result.im !== undefined) {
        setIsComplex(true);
        // Formater le nombre complexe pour l'affichage
        const reStr = result.re.toFixed(4).replace(/\.?0+$/, '');
        const imStr = Math.abs(result.im).toFixed(4).replace(/\.?0+$/, '');
        const sign = result.im >= 0 ? '+' : '-';
        setDisplay(`${reStr} ${sign} ${imStr}i`);
      } else {
        setIsComplex(false);
        setDisplay(String(result));
      }
      
      setExpression(String(result));
      setIsResult(true);
    } catch (error) {
      setDisplay('Error');
      setIsResult(true);
    }
  };

  const handleDecimal = () => {
    if (isResult) {
      setDisplay('0.');
      setExpression('0.');
      setIsResult(false);
    } else {
      if (!display.includes('.')) {
        setDisplay(display + '.');
        setExpression(expression + '.');
      }
    }
  };

  const handleFunction = (func: string) => {
    setIsResult(false);
    setDisplay(func + '(');
    setExpression(expression + func + '(');
  };

  const handleComplex = () => {
    setIsResult(false);
    setDisplay(display + 'i');
    setExpression(expression + 'i');
  };

  const handleConstant = (constant: string, value: string) => {
    if (isResult) {
      setDisplay(value);
      setExpression(value);
      setIsResult(false);
    } else {
      setDisplay(display + constant);
      setExpression(expression + value);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleGraphEquationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGraphEquation(e.target.value);
  };

  const handleParameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParameterA(Number(e.target.value));
  };

  const handleBackspace = () => {
    if (display !== '0' && !isResult) {
      if (display.length === 1) {
        setDisplay('0');
        setExpression(expression.slice(0, -1) || '0');
      } else {
        setDisplay(display.slice(0, -1));
        setExpression(expression.slice(0, -1));
      }
    }
  };

  const toggleAdvancedFunctions = () => {
    setShowAdvancedFunctions(!showAdvancedFunctions);
  };

  // Rendu du clavier adapté aux appareils mobiles
  const renderMobileKeyboard = () => {
    return (
      <div className="w-full">
        {/* Affichage des fonctions avancées si activées */}
        {showAdvancedFunctions && (
          <div className="grid grid-cols-4 gap-1 p-2">
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
              onClick={() => handleFunction('sin')}
            >
              sin
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
              onClick={() => handleFunction('cos')}
            >
              cos
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
              onClick={() => handleFunction('tan')}
            >
              tan
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
              onClick={() => handleFunction('log')}
            >
              log
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
              onClick={() => handleFunction('ln')}
            >
              ln
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
              onClick={() => handleFunction('sqrt')}
            >
              √
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
              onClick={() => handleOperatorClick('^')}
            >
              x^y
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
              onClick={() => handleConstant('π', 'pi')}
            >
              π
            </button>
            {activeTab === 'complex' && (
              <>
                <button
                  className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
                  onClick={() => handleFunction('abs')}
                >
                  |z|
                </button>
                <button
                  className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
                  onClick={() => handleFunction('arg')}
                >
                  arg
                </button>
                <button
                  className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
                  onClick={() => handleFunction('conj')}
                >
                  z*
                </button>
                <button
                  className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm"
                  onClick={() => handleFunction('exp')}
                >
                  e^z
                </button>
              </>
            )}
          </div>
        )}
        
        {/* Clavier principal */}
        <div className="grid grid-cols-4 gap-1 p-2">
          <button
            className="p-4 bg-gray-700 text-white rounded hover:bg-gray-600 text-lg"
            onClick={handleClear}
          >
            C
          </button>
          <button
            className="p-4 bg-gray-700 text-white rounded hover:bg-gray-600 text-lg"
            onClick={() => handleOperatorClick('(')}
          >
            (
          </button>
          <button
            className="p-4 bg-gray-700 text-white rounded hover:bg-gray-600 text-lg"
            onClick={() => handleOperatorClick(')')}
          >
            )
          </button>
          <button
            className="p-4 bg-orange-500 text-white rounded hover:bg-orange-400 text-lg"
            onClick={() => handleOperatorClick('/')}
          >
            ÷
          </button>
          <button
            className="p-4 bg-gray-600 text-white rounded hover:bg-gray-500 text-lg"
            onClick={() => handleNumberClick('7')}
          >
            7
          </button>
          <button
            className="p-4 bg-gray-600 text-white rounded hover:bg-gray-500 text-lg"
            onClick={() => handleNumberClick('8')}
          >
            8
          </button>
          <button
            className="p-4 bg-gray-600 text-white rounded hover:bg-gray-500 text-lg"
            onClick={() => handleNumberClick('9')}
          >
            9
          </button>
          <button
            className="p-4 bg-orange-500 text-white rounded hover:bg-orange-400 text-lg"
            onClick={() => handleOperatorClick('*')}
          >
            ×
          </button>
          <button
            className="p-4 bg-gray-600 text-white rounded hover:bg-gray-500 text-lg"
            onClick={() => handleNumberClick('4')}
          >
            4
          </button>
          <button
            className="p-4 bg-gray-600 text-white rounded hover:bg-gray-500 text-lg"
            onClick={() => handleNumberClick('5')}
          >
            5
          </button>
          <button
            className="p-4 bg-gray-600 text-white rounded hover:bg-gray-500 text-lg"
            onClick={() => handleNumberClick('6')}
          >
            6
          </button>
          <button
            className="p-4 bg-orange-500 text-white rounded hover:bg-orange-400 text-lg"
            onClick={() => handleOperatorClick('-')}
          >
            −
          </button>
          <button
            className="p-4 bg-gray-600 text-white rounded hover:bg-gray-500 text-lg"
            onClick={() => handleNumberClick('1')}
          >
            1
          </button>
          <button
            className="p-4 bg-gray-600 text-white rounded hover:bg-gray-500 text-lg"
            onClick={() => handleNumberClick('2')}
          >
            2
          </button>
          <button
            className="p-4 bg-gray-600 text-white rounded hover:bg-gray-500 text-lg"
            onClick={() => handleNumberClick('3')}
          >
            3
          </button>
          <button
            className="p-4 bg-orange-500 text-white rounded hover:bg-orange-400 text-lg"
            onClick={() => handleOperatorClick('+')}
          >
            +
          </button>
          <button
            className="p-4 bg-gray-600 text-white rounded hover:bg-gray-500 text-lg"
            onClick={() => handleNumberClick('0')}
          >
            0
          </button>
          <button
            className="p-4 bg-gray-600 text-white rounded hover:bg-gray-500 text-lg"
            onClick={handleDecimal}
          >
            .
          </button>
          {activeTab === 'complex' ? (
            <button
              className="p-4 bg-gray-600 text-white rounded hover:bg-gray-500 text-lg"
              onClick={() => handleComplex()}
            >
              i
            </button>
          ) : (
            <button
              className="p-4 bg-gray-600 text-white rounded hover:bg-gray-500 text-lg"
              onClick={handleBackspace}
            >
              ⌫
            </button>
          )}
          <button
            className="p-4 bg-orange-500 text-white rounded hover:bg-orange-400 text-lg"
            onClick={handleCalculate}
          >
            =
          </button>
        </div>
        
        {/* Bouton pour afficher/masquer les fonctions avancées */}
        <div className="p-2">
          <button
            className="w-full p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
            onClick={toggleAdvancedFunctions}
          >
            {showAdvancedFunctions ? 'Masquer fonctions avancées' : 'Afficher fonctions avancées'}
          </button>
        </div>
      </div>
    );
  };

  // Rendu du clavier standard pour desktop
  const renderDesktopKeyboard = () => {
    if (activeTab === 'standard') {
      return (
        <>
          {/* Fonctions mathématiques */}
          <div className="grid grid-cols-4 gap-1 p-2">
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={() => handleFunction('sin')}
            >
              sin
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={() => handleFunction('cos')}
            >
              cos
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={() => handleFunction('tan')}
            >
              tan
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={() => handleFunction('log')}
            >
              log
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={() => handleFunction('ln')}
            >
              ln
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={() => handleFunction('sqrt')}
            >
              √
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={() => handleOperatorClick('^')}
            >
              x^y
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={() => handleConstant('π', 'pi')}
            >
              π
            </button>
          </div>
          
          {/* Calculatrice standard */}
          <div className="grid grid-cols-4 gap-1 p-2">
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={handleClear}
            >
              C
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={() => handleOperatorClick('(')}
            >
              (
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={() => handleOperatorClick(')')}
            >
              )
            </button>
            <button
              className="p-3 bg-orange-500 text-white rounded hover:bg-orange-400"
              onClick={() => handleOperatorClick('/')}
            >
              ÷
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={() => handleNumberClick('7')}
            >
              7
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={() => handleNumberClick('8')}
            >
              8
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={() => handleNumberClick('9')}
            >
              9
            </button>
            <button
              className="p-3 bg-orange-500 text-white rounded hover:bg-orange-400"
              onClick={() => handleOperatorClick('*')}
            >
              ×
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={() => handleNumberClick('4')}
            >
              4
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={() => handleNumberClick('5')}
            >
              5
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={() => handleNumberClick('6')}
            >
              6
            </button>
            <button
              className="p-3 bg-orange-500 text-white rounded hover:bg-orange-400"
              onClick={() => handleOperatorClick('-')}
            >
              −
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={() => handleNumberClick('1')}
            >
              1
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={() => handleNumberClick('2')}
            >
              2
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={() => handleNumberClick('3')}
            >
              3
            </button>
            <button
              className="p-3 bg-orange-500 text-white rounded hover:bg-orange-400"
              onClick={() => handleOperatorClick('+')}
            >
              +
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500 col-span-2"
              onClick={() => handleNumberClick('0')}
            >
              0
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={handleDecimal}
            >
              .
            </button>
            <button
              className="p-3 bg-orange-500 text-white rounded hover:bg-orange-400"
              onClick={handleCalculate}
            >
              =
            </button>
          </div>
        </>
      );
    } else if (activeTab === 'complex') {
      return (
        <>
          {/* Fonctions pour nombres complexes */}
          <div className="grid grid-cols-4 gap-1 p-2">
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={() => handleComplex()}
            >
              i
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={() => handleFunction('abs')}
            >
              |z|
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={() => handleFunction('arg')}
            >
              arg(z)
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={() => handleFunction('conj')}
            >
              z*
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={() => handleFunction('re')}
            >
              Re
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={() => handleFunction('im')}
            >
              Im
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={() => handleFunction('exp')}
            >
              e^z
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={() => handleConstant('e', 'e')}
            >
              e
            </button>
          </div>
          
          {/* Clavier standard pour les nombres complexes */}
          <div className="grid grid-cols-4 gap-1 p-2">
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={handleClear}
            >
              C
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={() => handleOperatorClick('(')}
            >
              (
            </button>
            <button
              className="p-3 bg-gray-700 text-white rounded hover:bg-gray-600"
              onClick={() => handleOperatorClick(')')}
            >
              )
            </button>
            <button
              className="p-3 bg-orange-500 text-white rounded hover:bg-orange-400"
              onClick={() => handleOperatorClick('/')}
            >
              ÷
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={() => handleNumberClick('7')}
            >
              7
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={() => handleNumberClick('8')}
            >
              8
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={() => handleNumberClick('9')}
            >
              9
            </button>
            <button
              className="p-3 bg-orange-500 text-white rounded hover:bg-orange-400"
              onClick={() => handleOperatorClick('*')}
            >
              ×
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={() => handleNumberClick('4')}
            >
              4
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={() => handleNumberClick('5')}
            >
              5
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={() => handleNumberClick('6')}
            >
              6
            </button>
            <button
              className="p-3 bg-orange-500 text-white rounded hover:bg-orange-400"
              onClick={() => handleOperatorClick('-')}
            >
              −
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={() => handleNumberClick('1')}
            >
              1
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={() => handleNumberClick('2')}
            >
              2
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={() => handleNumberClick('3')}
            >
              3
            </button>
            <button
              className="p-3 bg-orange-500 text-white rounded hover:bg-orange-400"
              onClick={() => handleOperatorClick('+')}
            >
              +
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={() => handleNumberClick('0')}
            >
              0
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={handleDecimal}
            >
              .
            </button>
            <button
              className="p-3 bg-gray-600 text-white rounded hover:bg-gray-500"
              onClick={() => handleComplex()}
            >
              i
            </button>
            <button
              className="p-3 bg-orange-500 text-white rounded hover:bg-orange-400"
              onClick={handleCalculate}
            >
              =
            </button>
          </div>
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <div className={`w-full ${isMobile ? 'max-w-full' : 'max-w-md'} mx-auto bg-gray-800 rounded-lg overflow-hidden shadow-lg`}>
      <div className="p-4 bg-gray-900">
        <div className="text-right text-gray-400 text-sm h-6 overflow-hidden">
          {expression}
        </div>
        <div className="text-right text-white text-3xl font-semibold h-10 overflow-hidden">
          {display}
        </div>
      </div>
      
      {/* Onglets pour basculer entre les différents modes */}
      <div className="flex border-b border-gray-700">
        <button 
          className={`flex-1 py-2 px-4 bg-gray-800 text-white font-medium ${activeTab === 'standard' ? 'border-b-2 border-orange-500' : ''}`}
          onClick={() => handleTabChange('standard')}
        >
          Standard
        </button>
        <button 
          className={`flex-1 py-2 px-4 bg-gray-800 text-white font-medium ${activeTab === 'complex' ? 'border-b-2 border-orange-500' : ''}`}
          onClick={() => handleTabChange('complex')}
        >
          Complexe
        </button>
        <button 
          className={`flex-1 py-2 px-4 bg-gray-800 text-white font-medium ${activeTab === 'graph' ? 'border-b-2 border-orange-500' : ''}`}
          onClick={() => handleTabChange('graph')}
        >
          Graphique
        </button>
      </div>
      
      {activeTab === 'standard' && (
        <div className="p-0">
          {isMobile ? renderMobileKeyboard() : renderDesktopKeyboard()}
        </div>
      )}
      
      {activeTab === 'complex' && (
        <div className="p-0">
          {isMobile ? renderMobileKeyboard() : renderDesktopKeyboard()}
        </div>
      )}
      
      {activeTab === 'graph' && (
        <div className={`p-4 ${isMobile ? 'text-sm' : ''}`}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              Équation (utilisez 'z' comme variable complexe):
            </label>
            <input
              type="text"
              value={graphEquation}
              onChange={handleGraphEquationChange}
              className="w-full p-2 bg-gray-700 text-white rounded"
              placeholder="a^z - z"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              Paramètre a:
            </label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={parameterA}
              onChange={handleParameterChange}
              className="w-full"
            />
            <div className="text-white text-center">{parameterA}</div>
          </div>
          <div className={isMobile ? 'h-[300px]' : 'h-[400px]'}>
            <ComplexGraph equation={graphEquation.replace('a', String(parameterA))} parameter={parameterA} />
          </div>
        </div>
      )}
    </div>
  );
}
