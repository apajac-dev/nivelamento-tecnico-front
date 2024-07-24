'use client';
import styles from './type.module.css'; // Ajuste o caminho se necessário
import { useState, useEffect } from 'react';

interface Params {
  id: string;
}

const EditarDoador = ({ params }: { params: Params }) => {
  const [formData, setFormData] = useState({
    tipo_doador: '',
    nome: '',
    documento: '',
    valor: '',
    como_conheceu: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoador = async (id: string) => {
      try {
        const response = await fetch(`https://acolhimento-apajac-env-jonathan.squareweb.app/doador/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        const data = await response.json();
        setFormData({
          tipo_doador: data.tipoDoador || '',
          nome: data.nome || '',
          documento: data.documento || '',
          valor: data.valor ? data.valor.toString() : '',
          como_conheceu: data.comoConheceu || '',
        });
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchDoador(params.id);
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === 'nome' || name === 'como_conheceu') {
      formattedValue = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (name === 'documento') {
      formattedValue = value.replace(/\D/g, '');
      if (formData.tipo_doador === 'PJ') {
        formattedValue = formattedValue
          .slice(0, 14) // Limit to 14 digits
          .replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
      } else {
        formattedValue = formattedValue
          .slice(0, 11) // Limit to 11 digits
          .replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
      }
    } else if (name === 'valor') {
      formattedValue = value.replace(/\D/g, '');
    }

    setFormData({
      ...formData,
      [name]: formattedValue,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.nome) {
      setErrors({ nome: 'Nome é obrigatório.' });
      return;
    }

    try {
      const response = await fetch(`https://acolhimento-apajac-env-jonathan.squareweb.app/doador/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          valor: parseFloat(formData.valor.replace(/\D/g, '') || '0'), // Convert valor to number
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      alert('Doador atualizado com sucesso!');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este doador?')) {
      try {
        await fetch(`https://acolhimento-apajac-env-jonathan.squareweb.app/doador/${params.id}`, { method: 'DELETE' });
        alert('Doador excluído com sucesso!');
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipo = e.target.value;
    setFormData({
      ...formData,
      tipo_doador: tipo,
      documento: tipo === 'PJ'
        ? formData.documento.replace(/\D/g, '').slice(0, 14)
        : formData.documento.replace(/\D/g, '').slice(0, 11),
    });
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div className={styles.global}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>Editar Doador</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.fieldWrapper}>
              <label htmlFor="tipo_doador" className={styles.labelTipo}>Tipo:</label>
              <select
                id="tipo_doador"
                name="tipo_doador"
                value={formData.tipo_doador}
                onChange={handleTipoChange}
                className={styles.inputTipo}
              >
                <option value="PF">Pessoa Física</option>
                <option value="PJ">Pessoa Jurídica</option>
              </select>
            </div>
            <div className={styles.fieldWrapper}>
              <label htmlFor="nome" className={styles.labelNome}>Nome:</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome || ''}
                onChange={handleChange}
                className={styles.inputNome}
              />
              {errors.nome && <span className={styles.error}>{errors.nome}</span>}
            </div>
            <div className={styles.fieldWrapper}>
              <label htmlFor="documento" className={styles.labelDocumento}>Documento:</label>
              <input
                type="text"
                id="documento"
                name="documento"
                value={formData.documento || ''}
                onChange={handleChange}
                className={styles.inputDocumento}
              />
              {errors.documento && <span className={styles.error}>{errors.documento}</span>}
            </div>
            <div className={styles.fieldWrapper}>
              <label htmlFor="valor" className={styles.labelValor}>Valor doado:</label>
              <input
                type="text"
                id="valor"
                name="valor"
                value={formData.valor || ''}
                onChange={handleChange}
                className={styles.inputValor}
              />
              {errors.valor && <span className={styles.error}>{errors.valor}</span>}
            </div>
            <div className={styles.fieldWrapper}>
              <label htmlFor="como_conheceu" className={styles.labelConheceu}>Como conheceu a APAJAC?</label>
              <input
                type="text"
                id="como_conheceu"
                name="como_conheceu"
                value={formData.como_conheceu || ''}
                onChange={handleChange}
                className={styles.inputConheceu}
              />
              {errors.como_conheceu && <span className={styles.error}>{errors.como_conheceu}</span>}
            </div>
            <div className={styles.buttons}>
              <button type="button" className={styles.buttonDelete} onClick={handleDelete}>Excluir Doador</button>
              <button type="submit" className={styles.buttonSubmit}>Editar/Salvar Doador</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarDoador;
