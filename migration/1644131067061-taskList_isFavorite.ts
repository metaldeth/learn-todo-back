import {MigrationInterface, QueryRunner} from "typeorm";

export class taskListIsFavorite1644131067061 implements MigrationInterface {
    name = 'taskListIsFavorite1644131067061'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" ADD "isFavorite" boolean NOT NULL DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" ALTER COLUMN "isArchived" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "TaskListConnect" ALTER COLUMN "isArchived" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "TaskListConnect" ALTER COLUMN "isComplete" SET DEFAULT 'false'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "TaskListConnect" ALTER COLUMN "isComplete" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "TaskListConnect" ALTER COLUMN "isArchived" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" ALTER COLUMN "isArchived" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" DROP COLUMN "isFavorite"`);
    }

}
