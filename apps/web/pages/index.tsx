import {Button} from "ui";
import Head from "next/head";
import "ui/w3.css"
// import "../style/style.css";

export default function Web() {
     const ports = new Array(8).fill(0);

    return (
        <div>
            <Head>
                <title>Web</title>
            </Head>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '1vw'}}>
                {ports.map((port, index) => (
                    <iframe key={index} style={{width:'100%', height:'30vh'}} src={`http://localhost:300${index+1}`}></iframe>
                ))}

            </div>

        </div>
    );
}
