import * as React from "react";
import {Button} from "ui/Button";

export default function Store() {
    const [count, setCount] = React.useState(0);
    return (
        <div>
            <h1>Store</h1>
            <Button />
            <button onClick={() => setCount(count + 1)}>{count}</button>
        </div>
    );
}
