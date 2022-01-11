// import { Injectable, NotFoundException } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { ComentEntity } from "src/entities/coment/coment.entity";
// import { TaskEntity } from "src/entities/task/task.entity";
// import { UserEntity } from "src/entities/user/user.entity";
// import { Repository } from "typeorm";
// import { ComentDTO, CreateComentDTO } from "../dto/coment";

// @Injectable()
// export class ComentService {
//   constructor(
//     @InjectRepository(ComentEntity)
//     private repository: Repository<ComentEntity>,
//     @InjectRepository(TaskEntity)
//     private taskRepository: Repository<TaskEntity>,
//     @InjectRepository(UserEntity)
//     private userRepository: Repository<UserEntity>,
//   ){}

//   public async createTestConnectOnlyTask(data: CreateComentDTO): Promise<ComentDTO> {
    
//   }
// }