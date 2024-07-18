'use client';

import React, { useState, useEffect } from 'react';
import styles from './type.module.css';

interface Doador {
  id: number;
  nome: string;
  documento: string;
  valor: number;
  tipoDoador: 'PF' | 'PJ' | null;
  comoConheceu: string | null;
  idResponsavelPeloCadastro: number | null;
}

const Page: React.FC = () => {
  const [doadores, setDoadores] = useState<Doador[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDoadores();
  }, []);

  const fetchDoadores = async () => {
    try {
      const response = await fetch('https://acolhimento-apajac-env-jonathan.squareweb.app/doador/listar');
      if (response.ok) {
        const data = await response.json();
        console.log('Dados da API:', data); // Adicione este log para inspecionar a resposta da API
        if (Array.isArray(data.content)) {
          setDoadores(data.content);
        } else {
          setError('Erro: A resposta da API não contém um array de doadores.');
        }
      } else {
        setError('Erro ao buscar doadores: ' + response.statusText);
      }
    } catch (error: any) {
      setError('Erro na requisição: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.global}>
      <div className={styles.someClass}>
        <main className={styles.titulo}>
          <div className={styles.header}>
            <span>Consultar Doadores</span>
          </div>
          <div className={styles.subheader}><strong>Lista de Doadores</strong></div>
          {loading ? (
            <div>Carregando...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <tbody>
                  {doadores.map((doador) => (
                    <tr key={doador.id}>
                      <td className={styles.rounded}>{doador.nome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Page;
