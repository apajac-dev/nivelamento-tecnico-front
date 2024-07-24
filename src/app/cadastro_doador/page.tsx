'use client';

import React, { useState } from 'react';
import axios from 'axios';
import styles from './type.module.css';

interface FormData {
  nome: string;
  documento: string;
  valor: string;
  tipo_doador: 'PF' | 'PJ';
  como_conheceu: string;
}

interface FormErrors {
  nome: boolean;
  documento: boolean;
  valor: boolean;
  como_conheceu: boolean;
}

const CadastroDoador: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    documento: '',
    valor: '',
    tipo_doador: 'PF',
    como_conheceu: ''
  });

  const [errors, setErrors] = useState<FormErrors>({
    nome: false,
    documento: false,
    valor: false,
    como_conheceu: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (name === 'nome' || name === 'como_conheceu') {
      const filteredValue = value.replace(/[0-9]/g, '');
      setFormData({
        ...formData,
        [name]: filteredValue
      });
    } else if (name === 'documento') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
        .slice(0, 14);
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

    setErrors({
      ...errors,
      [name]: false
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Formulário enviado!', formData);

    const newErrors = {
      nome: !formData.nome,
      documento: !formData.documento,
      valor: !formData.valor,
      como_conheceu: !formData.como_conheceu
    };

    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (formData.documento && !cpfRegex.test(formData.documento)) {
      newErrors.documento = true;
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    try {
      const response = await axios.post('https://acolhimento-apajac-env-jonathan.squareweb.app/doador', {
        nome: formData.nome,
        documento: formData.documento,
        valor: parseFloat(formData.valor),
        tipo_doador: formData.tipo_doador,
        como_conheceu: formData.como_conheceu,
      });

      if (response.status === 200) {
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
        alert('Erro ao cadastrar doador. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro na requisição', error);
      alert('Erro na requisição. Por favor, tente novamente.');
    }
  };

  return (
    <div className={styles.global}>
      <main className={styles.titulo}>
        <div className={styles.header}>
          <span>Cadastro Doador</span>
        </div>
        <form onSubmit={handleSubmit} className={styles.form_label}>
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
            {errors.nome && <span className={styles.error}>Nome é obrigatório</span>}
          </div>
          <div className={styles.cpfField}>
            <label htmlFor="documento">Documento:</label>
            <input type="text" id="documento" name="documento" value={formData.documento} onChange={handleChange} required />
            {errors.documento && <span className={styles.error}>CPF inválido</span>}
          </div>
          <div className={styles.valorField}>
            <label htmlFor="valor">Valor doado:</label>
            <input type="number" id="valor" name="valor" value={formData.valor} onChange={handleChange} required />
            {errors.valor && <span className={styles.error}>Valor é obrigatório</span>}
          </div>
          <div className={styles.conheceuField}>
            <label htmlFor="como_conheceu">Como conheceu a APAJAC:</label>
            <input type="text" id="como_conheceu" name="como_conheceu" value={formData.como_conheceu} onChange={handleChange} required />
            {errors.como_conheceu && <span className={styles.error}>Este campo é obrigatório</span>}
          </div>
          <div className={styles.botaoField}>
            <button type="submit">Cadastrar Doador</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CadastroDoador;
