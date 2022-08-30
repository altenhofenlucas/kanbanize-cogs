import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Switch from "@mui/material/Switch";
import { Workflow } from "../../../BoardAnalysis";

type SelectBoardColumnsListProps = {
  workflow: Workflow,
  handleSelectColumn: (columnId: number) => void,
  isColumnSelected: (columnId: number) => boolean
 }

export function SelectBoardColumnsList({ workflow, handleSelectColumn, isColumnSelected }: SelectBoardColumnsListProps) {

  return (
    <List>
      {
        workflow.columns.map((column) => {
          return (
            <>
              <ListItem key={column.id}>
                <ListItemText key={column.name} id={`${column.id}`} primary={column.name} />
                <Switch
                  key={column.id}
                  edge="end"
                  onChange={() => handleSelectColumn(column.id)}
                  checked={isColumnSelected(column.id)}
                />
              </ListItem>
              <Divider light />
            </>
          )
        })
      }
    </List>
  )
}