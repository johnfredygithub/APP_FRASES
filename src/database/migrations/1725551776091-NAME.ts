import { MigrationInterface, QueryRunner } from "typeorm";

export class NAME1725551776091 implements MigrationInterface {
    name = 'NAME1725551776091'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "nombre" character varying(150) NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8c822438032e7cf019ccc97ef6e" UNIQUE ("nombre"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "phrase" ("ID" SERIAL NOT NULL, "FRASE" character varying(254) NOT NULL, "AUTOR" character varying(254) NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "extra_data1" character varying(254), "extra_data2" character varying(254), "CATEGORIAID" integer, CONSTRAINT "PK_6c8b9563812c0128f1c6f1733b5" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "email" character varying(50) NOT NULL, "password" character varying(250) NOT NULL, "recovery_token" character varying(250), "create_at" TIMESTAMP NOT NULL DEFAULT now(), "rol" character varying(150), "extra_data2" character varying(50), "extra_data3" character varying(50), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorites" ("user_id" integer NOT NULL, "phrase_id" integer NOT NULL, CONSTRAINT "PK_4c61a640e5000114427db4488c3" PRIMARY KEY ("user_id", "phrase_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_35a6b05ee3b624d0de01ee5059" ON "favorites" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_bef786273fe0a85ffa1ff0bb0b" ON "favorites" ("phrase_id") `);
        await queryRunner.query(`CREATE TABLE "dislike_phrases" ("user_id" integer NOT NULL, "phrase_id" integer NOT NULL, CONSTRAINT "PK_e3c22ca425040a9c88099c63471" PRIMARY KEY ("user_id", "phrase_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_098e19aa83906ab9a9d94990c9" ON "dislike_phrases" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_dcf95eed3aeb03a932ce1da66c" ON "dislike_phrases" ("phrase_id") `);
        await queryRunner.query(`ALTER TABLE "phrase" ADD CONSTRAINT "FK_aba656e253bb67bfc4725d38bda" FOREIGN KEY ("CATEGORIAID") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorites" ADD CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorites" ADD CONSTRAINT "FK_bef786273fe0a85ffa1ff0bb0bc" FOREIGN KEY ("phrase_id") REFERENCES "phrase"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dislike_phrases" ADD CONSTRAINT "FK_098e19aa83906ab9a9d94990c95" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "dislike_phrases" ADD CONSTRAINT "FK_dcf95eed3aeb03a932ce1da66cc" FOREIGN KEY ("phrase_id") REFERENCES "phrase"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dislike_phrases" DROP CONSTRAINT "FK_dcf95eed3aeb03a932ce1da66cc"`);
        await queryRunner.query(`ALTER TABLE "dislike_phrases" DROP CONSTRAINT "FK_098e19aa83906ab9a9d94990c95"`);
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_bef786273fe0a85ffa1ff0bb0bc"`);
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593"`);
        await queryRunner.query(`ALTER TABLE "phrase" DROP CONSTRAINT "FK_aba656e253bb67bfc4725d38bda"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dcf95eed3aeb03a932ce1da66c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_098e19aa83906ab9a9d94990c9"`);
        await queryRunner.query(`DROP TABLE "dislike_phrases"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bef786273fe0a85ffa1ff0bb0b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_35a6b05ee3b624d0de01ee5059"`);
        await queryRunner.query(`DROP TABLE "favorites"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "phrase"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
