import CadastrarDoador from "@/components/cadastrar-doador/cadastrar-doador";

type Params = {
    id: string;
};

type Props = {
    params: Params;
};



export default function Editar({params}: Props) {

    return(
        <main>
            <CadastrarDoador id={params.id} />
        </main>            
    );  
}