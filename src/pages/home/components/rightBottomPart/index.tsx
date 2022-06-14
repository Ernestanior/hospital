import { FC } from "react";
import Lastpart from "./lastPart";
import TableOne from "./tableOne";
import TableTwo from "./tableTwo";

interface IProps {
  reload: any;
}
const index: FC<IProps> = ({ reload }) => {
  return (
    <div>
      <section style={{ display: "flex", justifyContent: "space-around" }}>
        <TableOne reload={reload}></TableOne>
        <TableTwo reload={reload}></TableTwo>
      </section>

      <Lastpart reload={reload}></Lastpart>
    </div>
  );
};

export default index;
