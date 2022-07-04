import { Test } from '@nestjs/testing';
import { JobService } from './job.service';

describe('JobService', () => {
  let jdService: JobService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        providers: [JobService],
      }).compile();

    jdService = moduleRef.get<JobService>(JobService);
  });

  // describe('apply job', () => {
  //   it('should throw ', async () => {
  //     const result = ['test'];
  //     jest.spyOn(jdService, 'findAll').mockImplementation(() => result);

  //     expect(await jdService.findAll()).toBe(result);
  //   });
  // });
});