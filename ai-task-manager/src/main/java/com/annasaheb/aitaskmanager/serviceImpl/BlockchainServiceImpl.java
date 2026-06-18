package com.annasaheb.aitaskmanager.serviceImpl;

import org.springframework.stereotype.Service;

import com.annasaheb.aitaskmanager.entity.TaskBlock;
import com.annasaheb.aitaskmanager.repository.TaskBlockRepository;
import com.annasaheb.aitaskmanager.security.util.BlockchainUtil;
import com.annasaheb.aitaskmanager.service.BlockchainService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class BlockchainServiceImpl implements BlockchainService {

	private final TaskBlockRepository taskBlockRepository;

	private final BlockchainUtil blockchainUtil;

	@Override
	public void addBlock(Long taskId, String action) {

		TaskBlock previousBlock = taskBlockRepository.findTopByOrderByIdDesc();

		String previouHash = previousBlock == null ? "GENESIS" : previousBlock.getCurrentHash();

		String data = taskId + action + System.currentTimeMillis() + previouHash;

		String currentHash = blockchainUtil.generateHash(data);

		TaskBlock block = TaskBlock.builder().taskId(taskId).action(action).previousHash(previouHash).currentHash(currentHash).build();

		taskBlockRepository.save(block);

		log.info("Block added to blockchain for taskId: {} with action: {}", taskId, action);

	}

}
