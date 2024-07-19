'use client'

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ConsultarDoadores() {

    type Doador = {
        id: number;
        nome: string;
        documento: string;
        valor: number;
        tipo_doador: 'PF' | 'PJ';
        como_conheceu: string;
    }

    const [doadores, setDoadores] = useState<Doador[]>([]);

    useEffect(() => {

        const carregarDoadores = async () => {
            try {
                const response = await axios.get('https://acolhimento-apajac-env-leandro.squareweb.app/doador/listar');

                setDoadores(response.data.content);
            } catch (error) {
                console.error('Erro ao carregar doadores:', error);
            }
            
        };

        carregarDoadores();


    }, []); 

    return(
        <main className="min-h-screen flex flex-col items-center bg-blue-300">
            
            <div className="flex justify-center mt-20 mb-10">
                <Image 
                 src="/imageperson.png"
                 alt="Icone de pessoa"
                 width={24} 
                 height={24}
                />
                <h1 className="font-bold">Consultar Doadores </h1>
            </div>

            <div>
                <h1 className="font-bold mb-2">Lista de Doadores</h1>
            </div>

            <div className="flex bg-blue-400 w-96 h-auto rounded-lg text-white py-5 px-2">
                
            {doadores.length > 0 ? (
                <ul>
                    {doadores.map((doador) => (
                        <li className="py-2" key={doador.id}>
                            {doador.nome}
                        </li>
                    ))}       
                </ul>
                    
                
                ) : (
                <p>Nenhum doador encontrado.</p>

                )}   

            </div>
                                              
        </main>
    )
}