import React, { useState } from "react";
import _ from "lodash";

import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
function App() {
  const [islanders] = useState(createIslanderInitialState(10, 10));
  if (!islanders) {
    return <div>Loading</div>;
  }
  return (
    <React.Fragment>
      <AppBar position="sticky">
        <ToolBar />
      </AppBar>
      {islanders.map((islander, i) => (
        <Islander
          key={islander.id}
          listIndex={i}
          islander={islander}
          knownIslanders={islanders}
          allIslanders={islanders}
          unknownIslanderIds={[islander.id]}
        />
      ))}
    </React.Fragment>
  );
}

export default App;

function Islander({
  islander,
  listIndex,
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
          <div>
            {listIndex === 0 && (
              <Typography
                style={{
                  marginRight: "10px",
                  marginBottom: "5px",
                  fontWeight: "600",
                }}
              >
                {unknownIslanderIds.length === 1
                  ? "All Know"
                  : _.map(
                      unknownIslanderIds.slice(0, -1),
                      (id) => `${id} knows `
                    )}
              </Typography>
            )}
            <div style={{ display: "flex" }}>
              <Typography style={{ marginRight: "10px", paddingLeft: "5px" }}>
                {islander.id} sees:
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
            </div>
          </div>
        </AccordionSummary>
        {isExpanded &&
          otherIslanders.map((otherIslander, i) => (
            <React.Fragment key={otherIslander.id}>
              <Islander
                islander={otherIslander}
                knownIslanders={otherIslanders}
                allIslanders={allIslanders}
                unknownIslanderIds={[...unknownIslanderIds, otherIslander.id]}
                listIndex={i}
              />
            </React.Fragment>
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
