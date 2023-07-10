const Piece = (props) => {
  return (
    <div className={`piece ${props.player} ${props.piece}`}>
      {props.name !== 0 && props.name}
    </div>
  );
};

export default Piece;
