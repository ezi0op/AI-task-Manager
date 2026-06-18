package com.annasaheb.aitaskmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.annasaheb.aitaskmanager.entity.TaskBlock;

@Repository
public interface TaskBlockRepository
        extends JpaRepository<TaskBlock, Long> {

    TaskBlock findTopByOrderByIdDesc();
}