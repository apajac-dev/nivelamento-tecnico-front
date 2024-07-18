'use client';

import React from "react";
import axios from "axios";
import Image from "next/image";

export default function CadastrarDoador() {
    const [select, setSelect] = React.useState('PF');

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
            const response = await axios.post('https://acolhimento-apajac-env-leandro.squareweb.app/doador', data);
            console.log('Dados enviados:', response.data);

        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
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
                <h1 className="font-bold">Cadastrar Doador </h1>
            </div>


            <div className="flex justify-center">    
                <form onSubmit={handleSubmit}>

                    <div className="mb-5">
                        <label className="font-bold" htmlFor="tipoPessoa">Tipo</label>
                        <select
                         className="rounded-lg bg-gray-300 px-4 w-52 h-6 left-32 ml-16" 
                         value={select}
                         onChange={({ target }) => setSelect(target.value)}
                         id="tipo_doador"
                        >
                            <option value="PF">Pessoa física</option>
                            <option value="PJ">Pessoa jurídica</option>
                        </select>
			
                    </div>

                    <div className="mb-5">
                        <label className="font-bold" htmlFor="nome">Nome</label>
                        <input
                         className="rounded-lg bg-gray-300 px-4 w-80 h-6 left-32 ml-14"
                         type="text"
                         id="nome" 
                         name="nome"
                         required
                        />
                    </div>

                    <div className="mb-5">
                        <label className="font-bold" htmlFor="documento">Documento</label>
                        <input 
                         className="rounded-lg bg-gray-300 px-4 w-52 h-6 left-32 ml-4" 
                         type="number"
                         id="documento"
                         name="documento"
                         required
                        />
                    </div>

                    <div className="mb-2">
                        <label className="font-bold" htmlFor="valor">Valor doado</label>
                        <input 
                         className="rounded-lg bg-gray-300 px-4 ml-4 w-52" 
                         type="number"
                         id="valor" 
                         name="valor"
                         required
                        />
                    </div>

                    <div className="mb-auto">
                        <label className="flex h-4 font-bold" htmlFor="como_conheceu">Como<br/>conheceu a <br/> Apajac?</label>
                        <input className="rounded-lg bg-gray-300 px-4 w-52 h-6 ml-28 w-80" 
                         type="text"
                         id="como_conheceu"
                         name="como_conheceu"
                         required
                        />
                    </div>

                    <div className="flex flex-col justify-center px-14 ml-6 mt-14">
                        <button
                         className="h-9 bg-blue-600 rounded-md text-white max-w-60 text-sm"
                         type="submit"
                        >
                            CADASTRAR DOADOR
                        </button>
                    </div>   
                </form>
            </div>
        </main>
            
    );   
     
}