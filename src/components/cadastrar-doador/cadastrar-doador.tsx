'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

type Props = {
    id?: string | undefined;

}

type Doador = {
    nome: string;
    documento: string;
    valor: string;
    tipo_doador: 'PF' | 'PJ';
    como_conheceu: string;
}

export default function FormDoador({ id }: Props) {
    const [select, setSelect] = React.useState('PF');

    const [doador, setDoador] = React.useState<Doador>({
        nome: "",
        documento: "",
        valor: "",
        tipo_doador: "PF",
        como_conheceu: ""
    });

    useEffect(() => {
        if (id) {
           
            const carregarDoador =  async () => {

                try {
                    const response = await axios.get(`https://acolhimento-apajac-env-leandro.squareweb.app/doador/${id}`);
                    const data = response.data;
                
                    setDoador({
                        nome: data.nome,
                        documento: data.documento.toString(),
                        valor: data.valor.toString(),
                        tipo_doador: data.tipo_doador,
                        como_conheceu: data.como_conheceu

                    });

                    setSelect(data.tipo_doador);
                } catch (error) {
                    console.error('Erro ao carregar doador:', error);
                }
            };

            carregarDoador();
        }
    }, [id]);
    

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = {
            nome: formData.get('nome') as string,
            documento: Number(formData.get('documento')),
            valor: Number(formData.get('valor')),
            tipo_doador: select,
            como_conheceu: formData.get('como_conheceu') as string,
        };
    
        try {
            if (id) {
                await axios.put('https://acolhimento-apajac-env-leandro.squareweb.app/doador/${id}', data);
                console.log('Doador atualizado com sucesso!');
            } else {
                await axios.post('https://acolhimento-apajac-env-leandro.squareweb.app/doador', data);
                console.log('Doador cadastrado com sucesso!');
            }

        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
        }
        
    
    }

    
    const handleDelete = async () => {

        if(window.confirm('Tem certeza que deseja excluir este doador?')) {
            try {
                await axios.delete('https://acolhimento-apajac-env-leandro.squareweb.app/doador/${id}');
                console.log('Doador excluído com sucesso!');

        } catch (error) {
            console.error('Erro ao excluir o doador!', error);
            }
        }    
       
    }

    return(
        <main className="min-h-screen flex flex-col bg-blue-300">
            
            <div className="flex justify-center text-center mt-20 mb-10">
                <Image 
                 src="/imageperson.png"
                 alt="Icone de pessoa"
                 width={24} 
                 height={24}
                />
                <h1 className="font-bold">
                    {id ? "Editar Doador" : "Cadastrar Doador"} 
                </h1>
            </div>


            <div className="flex justify-center w-screen">    
                <form onSubmit={handleSubmit}>

                    <div className="mb-5">
                        <label className="font-bold inline-block w-24 mx-6" htmlFor="tipoPessoa">Tipo</label>
                        <select
                         className="rounded-lg bg-gray-300 px-4 w-48" 
                         value={select}
                         onChange={({ target }) => setSelect(target.value)}
                         id="tipo_doador"
                        >
                            <option value="PF">Pessoa física</option>
                            <option value="PJ">Pessoa jurídica</option>
                        </select>
			
                    </div>

                    <div className="mb-5">
                        <label className="font-bold inline-block w-24 mx-6" htmlFor="nome">Nome</label>
                        <input
                         className="rounded-lg bg-gray-300 px-4 w-72"
                         type="text"
                         id="nome" 
                         name="nome"
                         value={doador.nome}
                         onChange={(e) => setDoador({ ...doador, nome: e.target.value })}
                         required
                        />
                    </div>

                    <div className="mb-5">
                        <label className="font-bold inline-block w-24 mx-6" htmlFor="documento">Documento</label>
                        <input 
                         className="rounded-lg bg-gray-300 px-4 w-48" 
                         type="text"
                         id="documento"
                         name="documento"
                         value={doador.documento}
                         onChange={(e) => setDoador({ ...doador, documento: e.target.value })}
                         required
                        />
                    </div>

                    <div className="mb-2">
                        <label className="font-bold inline-block w-24 mx-6" htmlFor="valor">Valor doado</label>
                        <input 
                         className="rounded-lg bg-gray-300 px-4 w-48" 
                         type="text"
                         id="valor" 
                         name="valor"
                         value={doador.valor}
                         onChange={(e) => setDoador({ ...doador, valor: e.target.value })}
                         required
                        />
                    </div>

                    <div>
                        <label className="font-bold inline-block w-24 mx-6" htmlFor="como_conheceu">Como conheceu a Apajac?</label>
                        <input className="rounded-lg bg-gray-300 px-4 w-72" 
                         type="text"
                         id="como_conheceu"
                         name="como_conheceu"
                         value={doador.como_conheceu}
                         onChange={(e) => setDoador({ ...doador, como_conheceu: e.target.value })}
                         required
                        />
                    </div>

                    <div className="flex flex-col items-center mt-14">
                        {id && (
                            <button
                            className="h-8 bg-red-600 rounded-md text-white max-w-52 text-xs w-40 mx-6" 
                            type="button"
                            onClick={handleDelete}
                            >
                                EXCLUIR DOADOR
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col items-center mt-6">
                        <button
                         className="h-14 bg-blue-600 rounded-md text-white max-w-60 text-lg w-52 mx-6"
                         type="submit"
                        >
                            { id ? "EDITAR DOADOR" : "CADASTRAR DOADOR"}
                        </button>
                    </div>   
                </form>
            </div>
        </main>
            
    );   
     
}