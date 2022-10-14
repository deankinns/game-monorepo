import * as React from "react";
import {Button} from "ui/Button";
import Link from "next/link";

export default function Store() {
    const [count, setCount] = React.useState(0);


    return (
        <div>
            <Link href="/">home</Link>

            <h1>Store</h1>
            <Button/>
            <button onClick={() => setCount(count + 1)}>{count}</button>

        </div>
    );
}
