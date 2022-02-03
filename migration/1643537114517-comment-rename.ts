import {MigrationInterface, QueryRunner} from "typeorm";

export class commentRename1643537114517 implements MigrationInterface {
    name = 'commentRename1643537114517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "isArchived" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "caption" character varying(255) NOT NULL, "taskId" integer NOT NULL, "useId" integer NOT NULL, "userId" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" ALTER COLUMN "isArchived" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "TaskListConnect" ALTER COLUMN "isArchived" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_9fc19c95c33ef4d97d09b72ee95" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_9fc19c95c33ef4d97d09b72ee95"`);
        await queryRunner.query(`ALTER TABLE "TaskListConnect" ALTER COLUMN "isArchived" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "userTaskListConnect" ALTER COLUMN "isArchived" SET DEFAULT false`);
        await queryRunner.query(`DROP TABLE "comment"`);
    }

}
