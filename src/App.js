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
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";

// TODO: original All know is a little confusing because b1 couldn't know that b2 knows b1 sees b2's eye color
function App() {
  const [islanders, setIslanders] = useState(null);
  const [guruRevealedColor, setGuruRevealedColor] = useState(null);
  const [totalFerryTrips, setTotalFerryTrips] = useState(0);

  const handleCreateIslanders = (totalBlueEyed, totalRedEyed) => {
    setIslanders(createIslanderInitialState(totalBlueEyed, totalRedEyed));
  };

  const handleResetIsland = () => {
    setIslanders(null);
    setGuruRevealedColor(null);
    setTotalFerryTrips(0);
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
        totalFerryTrips={totalFerryTrips}
      />
      {islanders === null && (
        <CreateIsland onCreateIslanders={handleCreateIslanders} />
      )}
      {islanders && (
        <React.Fragment>
          <div
            style={{
              padding: "16px 0 0 16px",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FormControl>
              <InputLabel id="demo-simple-select-helper-label">
                Eye Color
              </InputLabel>
              <Select
                value={guruRevealedColor || ""}
                onChange={(e) => {
                  setGuruRevealedColor(e.target.value);
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="blue">Blue</MenuItem>
                <MenuItem value="red">Red</MenuItem>
              </Select>
              <FormHelperText>Guru speaks and sees...</FormHelperText>
            </FormControl>
            <div style={{ marginLeft: "10px" }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setTotalFerryTrips(totalFerryTrips + 1)}
                disabled={!guruRevealedColor}
              >
                Call Ferry
              </Button>
            </div>
          </div>
          {islanders &&
            islanders.map((islander, i) => (
              <Islander
                key={islander.id}
                listIndex={i}
                islander={islander}
                knownIslanders={islanders}
                allIslanders={islanders}
                unknownIslanderIds={[islander.id]}
                totalFerryTrips={totalFerryTrips}
                guruRevealedColor={guruRevealedColor}
              />
            ))}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default App;

function TopBar({
  totalBlueEyed,
  totalRedEyed,
  onResetIsland,
  totalFerryTrips,
}) {
  return (
    <AppBar position="sticky">
      <ToolBar style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex" }}>
          <Typography variant="h6">Total Blue Eyed: {totalBlueEyed}</Typography>
          <Typography variant="h6" style={{ margin: "0 10px" }}>
            |
          </Typography>
          <Typography variant="h6">Total Red Eyed: {totalRedEyed}</Typography>
          <Typography variant="h6" style={{ margin: "0 10px" }}>
            |
          </Typography>
          <Typography variant="h6">
            Total Ferry Trips: {totalFerryTrips}
          </Typography>
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
  totalFerryTrips,
  guruRevealedColor,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const seenIslanders = _.reject(knownIslanders, { id: islander.id });
  const otherIslanders = seenIslanders.map((otherIslander) =>
    decorateIslanderKnowledge(otherIslander, seenIslanders)
  );

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const knownBlueEyedIslanders = _.filter(otherIslanders, {
    eyeColor: "blue",
  });
  const knownRedEyedIslanders = _.filter(otherIslanders, {
    eyeColor: "red",
  });

  const knownTargetColorCount =
    guruRevealedColor === "blue"
      ? knownBlueEyedIslanders.length
      : knownRedEyedIslanders.length;

  const commonKnowledgeCount = guruRevealedColor ? totalFerryTrips + 1 : 0;

  const unknownOfTargetColor = commonKnowledgeCount - knownTargetColorCount;

  const IslanderDisplayGroup = ({
    islanderIds,
    color,
    showAggregate,
    IconOverride,
  }) =>
    showAggregate ? (
      <div
        style={{ marginRight: "10px", display: "flex", alignItems: "center" }}
      >
        <Typography style={{ marginRight: "2px" }}>
          {islanderIds.length}x
        </Typography>
        <Chip
          icon={IconOverride ? <IconOverride /> : <FaceIcon />}
          color={color}
          label={
            // TODO: this is backwards. Caller should provide blue/red and component should map to theme equivalent
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
            icon={IconOverride ? <IconOverride /> : <FaceIcon />}
            label={id}
            color={color}
            style={{ marginRight: "2px", minWidth: "63px" }}
          />
        ))}
      </div>
    );

  const willLeave =
    !!guruRevealedColor &&
    commonKnowledgeCount ===
      unknownIslanderIds.length + knownBlueEyedIslanders.length;

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
          style={{
            backgroundColor: willLeave ? "yellow" : isExpanded && "#3f51b514",
          }}
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
              {knownBlueEyedIslanders.length > 0 && (
                <IslanderDisplayGroup
                  islanderIds={_.map(knownBlueEyedIslanders, "id")}
                  color="primary"
                />
              )}
              {guruRevealedColor &&
                knownTargetColorCount < commonKnowledgeCount && (
                  <IslanderDisplayGroup
                    islanderIds={_.range(unknownOfTargetColor).map(() => "??")}
                    color={
                      guruRevealedColor === "blue" ? "primary" : "secondary"
                    }
                    IconOverride={CheckCircleOutlineIcon}
                  />
                )}
              {knownRedEyedIslanders.length > 0 && (
                <IslanderDisplayGroup
                  islanderIds={_.map(knownRedEyedIslanders, "id")}
                  color="secondary"
                />
              )}
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
                totalFerryTrips={totalFerryTrips}
                guruRevealedColor={guruRevealedColor}
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
