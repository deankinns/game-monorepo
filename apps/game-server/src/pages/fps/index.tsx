import {OrbitControls} from "@react-three/drei";
import {FirstPersonControls} from "becsy-fiber";

export default function Page() {
    return <div style={{position: "fixed", height: '100vh', width: '100vw', marginTop: '40px'}}>
        <div>
            <h3>Health</h3>
        </div>

        <div>
            <h3>Inventory</h3>
        </div>
    </div>;
}

Page.canvas = (props: any) => {
    return null
}