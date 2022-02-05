import {MigrationInterface, QueryRunner} from "typeorm";

export class debugUseIdByCommentEntity1644003498492 implements MigrationInterface {
    name = 'debugUseIdByCommentEntity1644003498492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "useId"`);
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" ALTER COLUMN "isArchived" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "TaskListConnect" ALTER COLUMN "isArchived" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "TaskListConnect" ALTER COLUMN "isComplete" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`ALTER TABLE "comment" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`ALTER TABLE "comment" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "TaskListConnect" ALTER COLUMN "isComplete" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "TaskListConnect" ALTER COLUMN "isArchived" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" ALTER COLUMN "isArchived" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "useId" integer NOT NULL`);
    }

}
