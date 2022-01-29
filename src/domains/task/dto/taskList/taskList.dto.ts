import { ApiProperty } from "@nestjs/swagger";

export class MemberByTaskList {
  @ApiProperty({ description: 'The id of the user' })
  id: number;

  @ApiProperty({ description: 'The user flag isOwner by taskListId' })
  isOwner: boolean;

  @ApiProperty({ description: 'The name of the user' })
  name: string;
}

export class TaskListDTO {
  @ApiProperty({ description: 'The id of the task list' })
  id: number;

  @ApiProperty({ description: 'The caption of the task list' })
  caption: string;
}

export class TaskListWithMemberListDTO {
  @ApiProperty({ description: 'The data of the taskList' })
  data: TaskListDTO;

  @ApiProperty({ description: 'The list of member by taskList' })
  listOfMember: Array<MemberByTaskList>;
}