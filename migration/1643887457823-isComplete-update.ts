import {MigrationInterface, QueryRunner} from "typeorm";

export class isCompleteUpdate1643887457823 implements MigrationInterface {
    name = 'isCompleteUpdate1643887457823'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "TaskListConnect" ADD "isComplete" boolean NOT NULL DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "likeCount" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" ALTER COLUMN "isArchived" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "TaskListConnect" ALTER COLUMN "isArchived" SET DEFAULT 'false'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "TaskListConnect" ALTER COLUMN "isArchived" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" ALTER COLUMN "isArchived" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "likeCount"`);
        await queryRunner.query(`ALTER TABLE "TaskListConnect" DROP COLUMN "isComplete"`);
    }

}
