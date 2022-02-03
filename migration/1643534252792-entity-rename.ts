import {MigrationInterface, QueryRunner} from "typeorm";

export class entityRename1643534252792 implements MigrationInterface {
    name = 'entityRename1643534252792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taskList" DROP CONSTRAINT "FK_0f5222a6533b98256610dcdb682"`);
        await queryRunner.query(`ALTER TABLE "taskList" DROP CONSTRAINT "FK_81ebc1748d8721f2d2b55deec91"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_e54d482833b899b32400e28ceac"`);
        await queryRunner.query(`ALTER TABLE "taskList" DROP COLUMN "connectTaskId"`);
        await queryRunner.query(`ALTER TABLE "taskList" DROP COLUMN "connectTaskListId"`);
        await queryRunner.query(`ALTER TABLE "taskList" DROP COLUMN "userConnectUserId"`);
        await queryRunner.query(`ALTER TABLE "taskList" DROP COLUMN "userConnectTaskListId"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "connectTaskId"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "connectTaskListId"`);
        await queryRunner.query(`ALTER TABLE "taskList" ADD "listOfTaskListConnectTaskId" integer`);
        await queryRunner.query(`ALTER TABLE "taskList" ADD "listOfTaskListConnectTaskListId" integer`);
        await queryRunner.query(`ALTER TABLE "taskList" ADD "listOfUserConnectUserId" integer`);
        await queryRunner.query(`ALTER TABLE "taskList" ADD "listOfUserConnectTaskListId" integer`);
        await queryRunner.query(`ALTER TABLE "task" ADD "listOfTaskListConnectTaskId" integer`);
        await queryRunner.query(`ALTER TABLE "task" ADD "listOfTaskListConnectTaskListId" integer`);
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" ALTER COLUMN "isArchived" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "TaskListConnect" ALTER COLUMN "isArchived" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "taskList" ADD CONSTRAINT "FK_504445c3d119c1e4fdcfb95115e" FOREIGN KEY ("listOfTaskListConnectTaskId", "listOfTaskListConnectTaskListId") REFERENCES "TaskListConnect"("taskId","taskListId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taskList" ADD CONSTRAINT "FK_6a7f7093e1629b61abdc595e71c" FOREIGN KEY ("listOfUserConnectUserId", "listOfUserConnectTaskListId") REFERENCES "userTaskListConnect"("userId","taskListId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_2fc94d603460316569867f8ddc4" FOREIGN KEY ("listOfTaskListConnectTaskId", "listOfTaskListConnectTaskListId") REFERENCES "TaskListConnect"("taskId","taskListId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_2fc94d603460316569867f8ddc4"`);
        await queryRunner.query(`ALTER TABLE "taskList" DROP CONSTRAINT "FK_6a7f7093e1629b61abdc595e71c"`);
        await queryRunner.query(`ALTER TABLE "taskList" DROP CONSTRAINT "FK_504445c3d119c1e4fdcfb95115e"`);
        await queryRunner.query(`ALTER TABLE "TaskListConnect" ALTER COLUMN "isArchived" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" ALTER COLUMN "isArchived" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "listOfTaskListConnectTaskListId"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "listOfTaskListConnectTaskId"`);
        await queryRunner.query(`ALTER TABLE "taskList" DROP COLUMN "listOfUserConnectTaskListId"`);
        await queryRunner.query(`ALTER TABLE "taskList" DROP COLUMN "listOfUserConnectUserId"`);
        await queryRunner.query(`ALTER TABLE "taskList" DROP COLUMN "listOfTaskListConnectTaskListId"`);
        await queryRunner.query(`ALTER TABLE "taskList" DROP COLUMN "listOfTaskListConnectTaskId"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "connectTaskListId" integer`);
        await queryRunner.query(`ALTER TABLE "task" ADD "connectTaskId" integer`);
        await queryRunner.query(`ALTER TABLE "taskList" ADD "userConnectTaskListId" integer`);
        await queryRunner.query(`ALTER TABLE "taskList" ADD "userConnectUserId" integer`);
        await queryRunner.query(`ALTER TABLE "taskList" ADD "connectTaskListId" integer`);
        await queryRunner.query(`ALTER TABLE "taskList" ADD "connectTaskId" integer`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_e54d482833b899b32400e28ceac" FOREIGN KEY ("connectTaskId", "connectTaskListId") REFERENCES "TaskListConnect"("taskId","taskListId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taskList" ADD CONSTRAINT "FK_81ebc1748d8721f2d2b55deec91" FOREIGN KEY ("userConnectUserId", "userConnectTaskListId") REFERENCES "userTaskListConnect"("userId","taskListId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taskList" ADD CONSTRAINT "FK_0f5222a6533b98256610dcdb682" FOREIGN KEY ("connectTaskId", "connectTaskListId") REFERENCES "TaskListConnect"("taskId","taskListId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
