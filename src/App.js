import React, { useState } from "react";
import _ from "lodash";

import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
function App() {
  const [islanders] = useState(createIslanderInitialState(5, 5));
  if (!islanders) {
    return <div>Loading</div>;
  }
  return (
    <Container maxWidth="lg">
      <AppBar position="sticky">
        <ToolBar />
      </AppBar>
      <Typography variant="subtitle1" style={{ marginRight: "5px" }}>
        All Islanders
      </Typography>
      {islanders.map((islander) => (
        <Islander
          key={islander.id}
          islander={islander}
          knownIslanders={islanders}
          allIslanders={islanders}
          unknownIslanderIds={[islander.id]}
        />
      ))}
    </Container>
  );
}

export default App;

function Islander({
  islander,
  knownIslanders,
  allIslanders,
  unknownIslanderIds,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const seenIslanders = _.reject(knownIslanders, { id: islander.id });
  const otherIslanders = seenIslanders.map((otherIslander) =>
    decorateIslanderKnowledge(otherIslander, seenIslanders)
  );

  const handleToggleExpand = () => {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  };

  const knownBlueEyedIslanders = _.filter(otherIslanders, {
    eyeColor: "blue",
  });
  const knownBrownEyedIslanders = _.filter(otherIslanders, {
    eyeColor: "red",
  });

  const IslanderDisplayGroup = ({ islanderIds, color }) => (
    <div style={{ marginRight: "10px" }}>
      {islanderIds.map((id) => (
        <Chip
          key={id}
          icon={<FaceIcon />}
          label={id}
          color={color}
          style={{ marginRight: "2px" }}
        />
      ))}
    </div>
  );

  return (
    <div>
      <Accordion
        square
        expanded={isExpanded}
        onChange={handleToggleExpand}
        style={{
          marginBottom: isExpanded && "40px",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          style={{ backgroundColor: isExpanded && "#3f51b514" }}
        >
          <Typography style={{ marginRight: "10px" }}>
            {islander.id} knows:
          </Typography>
          <IslanderDisplayGroup islanderIds={unknownIslanderIds} />
          <IslanderDisplayGroup
            islanderIds={_.map(knownBlueEyedIslanders, "id")}
            color="primary"
          />
          <IslanderDisplayGroup
            islanderIds={_.map(knownBrownEyedIslanders, "id")}
            color="secondary"
          />
        </AccordionSummary>
        {isExpanded &&
          otherIslanders.map((otherIslander) => (
            <Islander
              key={otherIslander.id}
              islander={otherIslander}
              knownIslanders={otherIslanders}
              allIslanders={allIslanders}
              unknownIslanderIds={[...unknownIslanderIds, otherIslander.id]}
            />
          ))}
      </Accordion>
    </div>
  );
}

function createIslanderInitialState(totalBlueEyed, totalBrownEyed) {
  const islanderStaticData = [
    ..._.range(1, totalBlueEyed + 1).map((idNum) => ({
      id: "B" + idNum,
      eyeColor: "blue",
    })),
    ..._.range(1, totalBrownEyed + 1).map((idNum) => ({
      id: "R" + idNum,
      eyeColor: "red",
    })),
  ];

  return islanderStaticData.map((islander) =>
    decorateIslanderKnowledge(islander, islanderStaticData)
  );
}

function decorateIslanderKnowledge(islander, allIslanders) {
  const otherIslanders = _.reject(allIslanders, { id: islander.id });
  const seenBlueEyedCount = _.filter(otherIslanders, {
    eyeColor: "blue",
  }).length;
  const seenBrownEyedCount = _.filter(otherIslanders, {
    eyeColor: "brown",
  }).length;
  return _.assign({}, islander, {
    knownBlueEyedCount: seenBlueEyedCount,
    knownBrownEyedCount: seenBrownEyedCount,
  });
}
