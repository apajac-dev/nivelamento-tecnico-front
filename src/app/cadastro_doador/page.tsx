'use client';

import React, { useState } from 'react';
import styles from './type.module.css';

const Page: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    documento: '',
    valor: '',
    tipo_doador: 'PF',
    como_conheceu: ''
  });

  // Estado para armazenar erros de validação
  const [errors, setErrors] = useState({
    nome: false,
    documento: false,
    valor: false,
    como_conheceu: false,
  });

  // Função para atualizar o estado do formulário e validar entradas
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    // Verifica se o campo é 'nome' ou 'como_conheceu' para impedir números
    if (name === 'nome' || name === 'como_conheceu') {
      const filteredValue = value.replace(/[0-9]/g, ''); // Remove números
      setFormData({
        ...formData,
        [name]: filteredValue
      });
    // Verifica se o campo é 'documento' e aplica máscara
    } else if (name === 'documento') {
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

    // Reseta o erro do campo alterado
    setErrors({
      ...errors,
      [name]: false
    });
  };

  // Função para manipular a submissão do formulário e validar entradas
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Formulário enviado!', formData);

    // Valida campos obrigatórios
    const newErrors = {
      nome: !formData.nome,
      documento: !formData.documento,
      valor: !formData.valor,
      como_conheceu: !formData.como_conheceu
    };

    // Valida formato de CPF no campo documento
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (formData.documento && !cpfRegex.test(formData.documento)) {
      newErrors.documento = true;
    }

    setErrors(newErrors);

    // Se houver erros, alerta o usuário e interrompe a submissão
    if (Object.values(newErrors).some(error => error)) {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    // Envia a requisição POST para o backend
    try {
      const response = await fetch('https://acolhimento-apajac-env-jonathan.squareweb.app/doador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          documento: formData.documento,
          valor: parseFloat(formData.valor),
          tipo_doador: formData.tipo_doador,
          como_conheceu: formData.como_conheceu,
        }),
      });

      if (response.ok) {
        console.log('Doador cadastrado com sucesso!');
        alert('Doador cadastrado com sucesso!');
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
