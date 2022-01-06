import {MigrationInterface, QueryRunner} from "typeorm";

export class test1641457596609 implements MigrationInterface {
    name = 'test1641457596609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taskList" DROP CONSTRAINT "FK_5a38eb317f69992d12801ca3d9a"`);
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" DROP CONSTRAINT "PK_73fa36e0af3128c8bf6f5843a4c"`);
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "taskList" DROP COLUMN "userConnectId"`);
        await queryRunner.query(`ALTER TABLE "taskList" ADD "userConnectUserId" integer`);
        await queryRunner.query(`ALTER TABLE "taskList" ADD "userConnectTaskListId" integer`);
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" ADD CONSTRAINT "PK_93ec534cbde6f7b9bcb4c3df0ab" PRIMARY KEY ("userId", "taskListId")`);
        await queryRunner.query(`ALTER TABLE "taskList" ADD CONSTRAINT "FK_81ebc1748d8721f2d2b55deec91" FOREIGN KEY ("userConnectUserId", "userConnectTaskListId") REFERENCES "userTaskListConnect"("userId","taskListId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taskList" DROP CONSTRAINT "FK_81ebc1748d8721f2d2b55deec91"`);
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" DROP CONSTRAINT "PK_93ec534cbde6f7b9bcb4c3df0ab"`);
        await queryRunner.query(`ALTER TABLE "taskList" DROP COLUMN "userConnectTaskListId"`);
        await queryRunner.query(`ALTER TABLE "taskList" DROP COLUMN "userConnectUserId"`);
        await queryRunner.query(`ALTER TABLE "taskList" ADD "userConnectId" integer`);
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" ADD "id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" ADD CONSTRAINT "PK_73fa36e0af3128c8bf6f5843a4c" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "taskList" ADD CONSTRAINT "FK_5a38eb317f69992d12801ca3d9a" FOREIGN KEY ("userConnectId") REFERENCES "userTaskListConnect"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
