import FormDoador from "@/components/cadastrar-doador/form-doador";

type Params = {
    id: string;
};

type Props = {
    params: Params;
};



export default function Editar({ params }: Props) {

    console.log("parms:" + params.id);
    return(
        <main>
            <FormDoador id={params.id} />
        </main>            
    );  
}