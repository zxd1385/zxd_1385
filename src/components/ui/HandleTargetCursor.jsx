import { useState } from "react"
import { Checkbox } from "@chakra-ui/react"
import TargetCursor from "./TargetCursor"

function HandleTargetCursor() {
    const [checked, setChecked] = useState(false)
    return(
        <>
        <Checkbox.Root
      
      checked={checked}
      onCheckedChange={(e) => setChecked(!!e.checked)}
      pt={"4"}
      pl={2}
    >
      <Checkbox.HiddenInput />
      <Checkbox.Control />
      <Checkbox.Label color={"white"} fontSize={"0.9rem"}>Toggle Cursor</Checkbox.Label>
    </Checkbox.Root>

    {!checked && <TargetCursor 
              spinDuration={2}
              hideDefaultCursor
              parallaxOn
              hoverDuration={0.2}
      />}
       </>
    )

}

export default HandleTargetCursor