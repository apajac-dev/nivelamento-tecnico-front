// Adicione "use client" no topo do arquivo para tornar este componente um componente cliente
'use client';

import React, { useState } from 'react'; // Importa React e useState do React
import styles from './type.module.css'; // Importa o arquivo CSS de módulo

const Page: React.FC = () => {
  // useState para controlar os valores do formulário
  const [formData, setFormData] = useState({
    nome: '',
    documento: '',
    valor: '',
    tipo_doador: 'PF',
    como_conheceu: ''
  });

  // Função para atualizar o estado do formulário quando o usuário digita
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    // Verifica se o campo é o documento (CPF) e aplica a máscara
    if (name === 'documento') {
      const formattedValue = value
        .replace(/\D/g, '') // Remove todos os caracteres não numéricos
        .replace(/^(\d{3})(\d)/, '$1.$2') // Coloca o primeiro ponto
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3') // Coloca o segundo ponto
        .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4') // Coloca o traço
        .slice(0, 14); // Limita o tamanho máximo do CPF

      setFormData({
        ...formData,
        [name]: formattedValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Função para manipular a submissão do formulário
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Evita o comportamento padrão de submissão do formulário
    console.log('Formulário enviado!', formData); // Imprime os dados do formulário no console

    // Validar campos obrigatórios
    if (!formData.nome || !formData.documento || !formData.valor || !formData.como_conheceu) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Validar formato de CPF no campo documento
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (formData.documento && !cpfRegex.test(formData.documento)) {
      alert('O campo Documento deve estar no formato de CPF (123.123.123-12).');
      return;
    }

    // Envia a requisição POST para o backend
    try {
      const response = await fetch('https://acolhimento-apajac-env-jonathan.squareweb.app/doador', {
        method: 'POST', // Define o método HTTP como POST
        headers: {
          'Content-Type': 'application/json', // Define o tipo de conteúdo como JSON
        },
        body: JSON.stringify({
          nome: formData.nome,
          documento: formData.documento,
          valor: parseFloat(formData.valor), // Converte o valor para float
          tipo_doador: formData.tipo_doador,
          como_conheceu: formData.como_conheceu,
        }),
      });

      // Verifica se a resposta é bem-sucedida
      if (response.ok) {
        console.log('Doador cadastrado com sucesso!');
        alert('Doador cadastrado com sucesso!');

        //limpar campos

        setFormData({
          nome: '',
          documento: '',
          valor: '',
          tipo_doador: 'PF',
          como_conheceu: ''
        });
    
      } else {
        console.error('Erro ao cadastrar doador');
      }
    } catch (error) {
      console.error('Erro na requisição', error);
    }
  };

  return (
    <div className={styles.global}>
      <div className={styles.someClass}>
        <main className={styles.titulo}>
          <div className={styles.header}>
            <span>Cadastro Doador</span>
          </div>
          <div className={styles.form_label}>
            <form onSubmit={handleSubmit}>
              <div className={styles.selectField}>
                <label htmlFor="tipo">Tipo:</label>
                <select name="tipo_doador" id="tipo" value={formData.tipo_doador} onChange={handleChange} required>
                  <option value="PF">Pessoa Física</option>
                  <option value="PJ">Pessoa Jurídica</option>
                </select>
              </div>
              <div className={styles.nomeField}>
                <label htmlFor="nome">Nome:</label>
                <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
              </div>
              <div className={styles.cpfField}>
                <label htmlFor="cpf">Documento (CPF):</label>
                <input type="text" id="cpf" name="documento" value={formData.documento} onChange={handleChange} maxLength={14} />
              </div>
              <div className={styles.valorField}>
                <label htmlFor="valor_doado">Valor doado:</label>
                <input type="number" id="valor_doado" name="valor" value={formData.valor} onChange={handleChange} required />
              </div>
              <div className={styles.conheceuField}>
                <label htmlFor="como_conheceu">Como conheceu a APAJAC?</label>
                <input type="text" id="como_conheceu" name="como_conheceu" value={formData.como_conheceu} onChange={handleChange} required />
              </div>
              <button type="submit" className={styles['button-submit']}>CADASTRAR DOADOR</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;