import React, { useState } from "react";
import _ from "lodash";

import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
function App() {
  const [islanders, setIslanders] = useState(null);

  const handleCreateIslanders = (totalBlueEyed, totalRedEyed) => {
    setIslanders(createIslanderInitialState(totalBlueEyed, totalRedEyed));
  };

  const handleResetIsland = () => {
    setIslanders(null);
  };

  const totalBlueEyed = islanders
    ? _.filter(islanders, { eyeColor: "blue" }).length
    : 0;
  const totalRedEyed = islanders
    ? _.filter(islanders, { eyeColor: "red" }).length
    : 0;

  return (
    <React.Fragment>
      <TopBar
        totalBlueEyed={totalBlueEyed}
        totalRedEyed={totalRedEyed}
        onResetIsland={handleResetIsland}
      />
      {islanders === null && (
        <CreateIsland onCreateIslanders={handleCreateIslanders} />
      )}
      {islanders &&
        islanders.map((islander, i) => (
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

function TopBar({ totalBlueEyed, totalRedEyed, onResetIsland }) {
  return (
    <AppBar position="sticky">
      <ToolBar style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex" }}>
          <Typography variant="h6">Total Blue Eyed: {totalBlueEyed}</Typography>
          <Typography variant="h6" style={{ margin: "0 10px" }}>
            |
          </Typography>
          <Typography variant="h6">Total Red Eyed: {totalRedEyed}</Typography>
        </div>
        <Button variant="contained" color="secondary" onClick={onResetIsland}>
          Reset Island
        </Button>
      </ToolBar>
    </AppBar>
  );
}

function CreateIsland({ onCreateIslanders }) {
  const [totalBlueEyed, setTotalBlueEyed] = useState(0);
  const [totalRedEyed, setTotalRedEyed] = useState(0);

  return (
    <div
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4">New Island</Typography>
      <div style={{ marginTop: "10px" }}>
        <TextField
          label="Total Blue Eyed"
          type="number"
          style={{ marginRight: "20px" }}
          value={totalBlueEyed || totalBlueEyed === 0 ? totalBlueEyed : ""}
          onChange={(e) => setTotalBlueEyed(parseInt(e.target.value))}
        />
        <TextField
          label="Total Red Eyed"
          type="number"
          value={totalRedEyed || totalRedEyed === 0 ? totalRedEyed : ""}
          onChange={(e) => setTotalRedEyed(parseInt(e.target.value))}
        />
      </div>
      <div>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "20px" }}
          onClick={() => onCreateIslanders(totalBlueEyed, totalRedEyed)}
        >
          Create Island
        </Button>
      </div>
    </div>
  );
}

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

  const IslanderDisplayGroup = ({ islanderIds, color, showAggregate }) =>
    showAggregate ? (
      <div
        style={{ marginRight: "10px", display: "flex", alignItems: "center" }}
      >
        <Typography style={{ marginRight: "2px" }}>
          {islanderIds.length}x
        </Typography>
        <Chip
          icon={<FaceIcon />}
          color={color}
          label={
            color === "primary" ? "Blue" : color === "secondary" ? "Red" : "?"
          }
          style={{ marginRight: "2px" }}
        />
      </div>
    ) : (
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
            <div style={{ display: "flex", alignItems: "center" }}>
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
