import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1682288679897 implements MigrationInterface {
    name = 'Default1682288679897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investigations" DROP COLUMN "files"`);
        await queryRunner.query(`ALTER TABLE "investigations" ADD "files" bytea`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investigations" DROP COLUMN "files"`);
        await queryRunner.query(`ALTER TABLE "investigations" ADD "files" bytea array NOT NULL`);
    }

}
