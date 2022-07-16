import { jsPDF } from 'jspdf'


interface ValueInterface   {
    id: number,
    name: string,
    salary: number
}

interface analisedInterface extends ValueInterface{
    difference: number
}


const referenceDataJson = {
    "data":[
        {"id": 1, "name":"Henrique", "salary": 1200},
        {"id": 2, "name":"Ananda", "salary": 1700},
        {"id": 3, "name":"Allef", "salary": 1500},
        {"id": 4, "name":"Jose", "salary": 1000}
    ]
}

const sendDataJson = {
    "data":[
        {"id": 1, "name":"Henrique", "salary": 1205.02},
        {"id": 2, "name":"Ananda", "salary": 1100},
        {"id": 3, "name":"Allef", "salary": 1500},
        {"id": 4, "name":"Jose", "salary": 1250}
    ]
}

const totalDifference = (referenceValues : ValueInterface [] , sendValues : ValueInterface [])=>{
  const sumReferenceValues = referenceValues.reduce((previousValue : number, curretValue : ValueInterface) => previousValue + curretValue.salary ,0)
  const sumSendValues = sendValues.reduce((previousValue : number, curretValue : ValueInterface) => previousValue + curretValue.salary ,0)

  const differenceTotal = sumReferenceValues - sumSendValues 

  return Math.abs(differenceTotal)
}


const analysisValues = (referenceValues : ValueInterface [] , sendValues : ValueInterface []) => {

   

    const resultado : analisedInterface[] = []
    
    // Acha os colaboradores com salarios errados e armazenas suas respectivas diferenças
    referenceValues.forEach(( trueValue : ValueInterface) =>{
        sendValues.forEach((sendValue : ValueInterface) => {
            if (trueValue.id === sendValue.id && trueValue.salary !== sendValue.salary ) {
                const difference = Math.abs(trueValue.salary - sendValue.salary)
                resultado.push({...sendValue , difference })
            }
        })
        
    })
    
    // Chama a função que obtem a diferença entre os valores totais de ambas as folhas
    const valueTotalDifference = totalDifference(referenceValues, sendValues) 

    // Calculo da média das diferenças
    
    // Soma todas as diferenças obtidas anteriormente
    const sumDifferences = resultado.reduce((previous : number , current) => previous + current.difference , 0)
    // Executa o calculo da média
    const mediaDifferences = sumDifferences / referenceValues.length
    

    gerarPDF(resultado,mediaDifferences,valueTotalDifference)
    
    

}

const gerarPDF = ( resultado : analisedInterface[] ,mediaDifferences : number, valueTotalDifference: number )=>{
  const doc = new jsPDF()

  resultado.forEach((value , index ) => {
    doc.text(`Nome : ${value.name}, está com uma diferença de R$ ${value.difference.toFixed(2)}`,10, (index + 1)* 10)  
  })
  doc.text(`Diferença entre o valor da folha de referência e o valor enviado é :${valueTotalDifference.toFixed(2)}`,10 , (resultado.length+1) * 10)
  doc.text(`Diferencas das médias : ${mediaDifferences.toFixed(2)}`,10 , (resultado.length + 2) * 10)

  doc.save("relatorio.pdf")
}

function App() {


  return (
    <div className="App">
      <button onClick={()=>analysisValues(referenceDataJson.data, sendDataJson.data)}>Gerar Relatório</button>
    </div>
  );
}

export default App;
