const Piece = (props) => {
  console.log(props);
  return (
    <div class={`piece ${props.player} ${props.piece}`}>
      {props.name !== 0 && props.name}
    </div>
  );
};

export default Piece;
