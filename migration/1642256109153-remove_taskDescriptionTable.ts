import {MigrationInterface, QueryRunner} from "typeorm";

export class removeTaskDescriptionTable1642256109153 implements MigrationInterface {
    name = 'removeTaskDescriptionTable1642256109153'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" RENAME COLUMN "taskDescriptionId" TO "description"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "description" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "description" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" RENAME COLUMN "description" TO "taskDescriptionId"`);
    }

}
