
const Tooltip = ({sentence, sentence_sent_score}) => {
  return (
    `<div>
      Sentence: ${sentence}
      <span>
        Sentence sentiment score:
        <strong>${sentence_sent_score}</strong>
      </span>
    </div>`
  );
};

export default Tooltip;
