import {MigrationInterface, QueryRunner} from "typeorm";

export class isArchiverFlagByConnect1643100685629 implements MigrationInterface {
    name = 'isArchiverFlagByConnect1643100685629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" ADD "isArchived" boolean NOT NULL DEFAULT 'true'`);
        await queryRunner.query(`ALTER TABLE "TaskListConnect" ADD "isArchived" boolean NOT NULL DEFAULT 'true'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "TaskListConnect" DROP COLUMN "isArchived"`);
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" DROP COLUMN "isArchived"`);
    }

}
